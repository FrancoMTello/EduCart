# tests/test_products.py
from fastapi.testclient import TestClient

def test_get_all_products_empty(client: TestClient):
    """Verifica que el catálogo inicial devuelva una lista (vacía o cargada)"""
    response = client.get("/products/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_product(client: TestClient):
    """Verifica la creación exitosa de un producto"""
    payload = {
        "sku": "TEST-001",
        "name": "Manual de Python Testing",
        "category": "Libros",
        "price": 4500.0,
        "stock_actual": 10,
        "stock_minimo": 2,
        "image_url": "https://example.com/test.jpg"
    }
    response = client.post("/products/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["sku"] == "TEST-001"
    assert data["name"] == "Manual de Python Testing"
    assert data["price"] == 4500.0

def test_update_product_stock(client: TestClient):
    """Verifica la actualización parcial (PATCH) del stock de un producto"""
    # 1. Crear producto base
    payload = {
        "sku": "TEST-002",
        "name": "Kit Arduino Uno",
        "category": "Robotica",
        "price": 12000.0,
        "stock_actual": 5,
        "stock_minimo": 1
    }
    created = client.post("/products/", json=payload).json()
    product_id = created["id"]

    # 2. Modificar el stock
    patch_payload = {"stock_actual": 20, "price": 11500.0}
    response = client.patch(f"/products/{product_id}", json=patch_payload)
    
    assert response.status_code == 200
    updated_data = response.json()
    assert updated_data["stock_actual"] == 20
    assert updated_data["price"] == 11500.0