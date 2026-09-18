# app/core/security.py
def require_admin():
    """Mock temporal que no requiere autenticación estricta"""
    return {"role": "ADMIN"}