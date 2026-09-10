from sqlmodel import Session, select
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate
from fastapi import HTTPException

def create(session: Session, data: OrderCreate, user_id: int) -> Order:
    """Crea una orden — verifica stock y resta unidades"""
    
    items = []
    total = 0.0

    for item_data in data.items:
        # Busca el producto
        product = session.get(Product, item_data.product_id)
        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Producto {item_data.product_id} no encontrado."
            )
        
        # Verifica stock
        if product.stock_actual < item_data.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Stock insuficiente para {product.name}. Disponible: {product.stock_actual}"
            )
        
        # Resta el stock
        product.stock_actual -= item_data.quantity
        session.add(product)

        subtotal = product.price * item_data.quantity
        total += subtotal

        items.append(OrderItem(
            product_id=product.id,
            product_name=product.name,
            product_price=product.price,
            quantity=item_data.quantity,
            subtotal=subtotal
        ))

    # Crea la orden
    order = Order(user_id=user_id, total=total, status="PENDING")
    session.add(order)
    session.flush()  # genera el id de la orden sin hacer commit

    # Asigna el order_id a cada item
    for item in items:
        item.order_id = order.id
        session.add(item)

    session.commit()
    session.refresh(order)
    return order

def get_by_user(session: Session, user_id: int) -> list[Order]:
    """Trae todas las órdenes de un usuario"""
    return session.exec(
        select(Order).where(Order.user_id == user_id)
    ).all()

def get_all(session: Session) -> list[Order]:
    """Trae todas las órdenes — solo para ADMIN"""
    return session.exec(select(Order)).all()