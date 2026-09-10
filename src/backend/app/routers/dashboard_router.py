from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from app.core.database import get_session
from app.security import require_admin
from app.models.order import Order, OrderItem
from app.models.product import Product

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats")
def get_stats(
    session: Session = Depends(get_session),
    _: dict = Depends(require_admin)
):
    """KPIs principales del dashboard"""

    # Total de órdenes
    total_orders = session.exec(select(func.count(Order.id))).one()

    # Valor total de ventas
    total_sales = session.exec(select(func.sum(Order.total))).one() or 0

    # Productos con stock bajo o agotado
    low_stock = session.exec(
        select(Product).where(Product.stock_actual <= Product.stock_minimo)
    ).all()

    # Valor total del inventario
    inventory_value = session.exec(
        select(func.sum(Product.price * Product.stock_actual))
    ).one() or 0

    # Top 5 productos más vendidos
    top_products = session.exec(
        select(
            OrderItem.product_name,
            func.sum(OrderItem.quantity).label("total_sold")
        )
        .group_by(OrderItem.product_name)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(5)
    ).all()

    # Distribución por categoría
    category_distribution = session.exec(
        select(
            Product.category,
            func.count(Product.id).label("count"),
            func.sum(Product.stock_actual).label("total_stock")
        )
        .group_by(Product.category)
    ).all()

    return {
        "total_orders": total_orders,
        "total_sales": total_sales,
        "low_stock_count": len(low_stock),
        "inventory_value": inventory_value,
        "top_products": [
            {"name": p.product_name, "total_sold": p.total_sold}
            for p in top_products
        ],
        "category_distribution": [
            {
                "category": c.category,
                "count": c.count,
                "total_stock": c.total_stock
            }
            for c in category_distribution
        ],
        "low_stock_products": [
            {
                "id": p.id,
                "sku": p.sku,
                "name": p.name,
                "category": p.category,
                "stock_actual": p.stock_actual,
                "stock_minimo": p.stock_minimo,
                "status": "Agotado" if p.stock_actual == 0 else "Stock bajo"
            }
            for p in low_stock
        ]
    }