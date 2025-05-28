from sqlalchemy import (
    Column,
    Integer,
    Text,
    String,
    DateTime,
    Boolean,
    ForeignKey,
    func
)
from sqlalchemy.orm import relationship
from .meta import Base


class Kategori(Base):
    """Model untuk kategori menu"""
    __tablename__ = 'kategori'
    
    kategori_id = Column(Integer, primary_key=True)
    nama_kategori = Column(String(100), nullable=False)
    icon = Column(String(255))
    
    # Relationship
    menus = relationship("Menu", back_populates="kategori")
    
    def to_dict(self):
        return {
            'kategori_id': self.kategori_id,
            'nama_kategori': self.nama_kategori,
            'icon': self.icon
        }


class Menu(Base):
    """Model untuk menu makanan"""
    __tablename__ = 'menu'
    
    menu_id = Column(Integer, primary_key=True)
    kategori_id = Column(Integer, ForeignKey('kategori.kategori_id'), nullable=False)
    nama_menu = Column(String(255), nullable=False)
    deskripsi = Column(Text)
    harga = Column(Integer, nullable=False)
    image = Column(String(255))
    status = Column(String(20), default='tersedia')
    create_at = Column(DateTime, default=func.now())
    
    # Relationships
    kategori = relationship("Kategori", back_populates="menus")
    order_details = relationship("OrderDetails", back_populates="menu")
    keranjangs = relationship("Keranjang", back_populates="menu")
    
    def to_dict(self):
        return {
            'menu_id': self.menu_id,
            'kategori_id': self.kategori_id,
            'nama_menu': self.nama_menu,
            'deskripsi': self.deskripsi,
            'harga': self.harga,
            'image': self.image,
            'status': self.status,
            'create_at': self.create_at.isoformat() if self.create_at else None,
            'kategori': self.kategori.to_dict() if self.kategori else None
        }


class Roles(Base):
    """Model untuk roles pengguna"""
    __tablename__ = 'roles'
    
    role_id = Column(Integer, primary_key=True)
    role_name = Column(String(50), nullable=False)
    permissions = Column(Text)
    
    # Relationship
    users = relationship("Users", back_populates="role")
    
    def to_dict(self):
        return {
            'role_id': self.role_id,
            'role_name': self.role_name,
            'permissions': self.permissions
        }


class Users(Base):
    """Model untuk users"""
    __tablename__ = 'users'
    
    user_id = Column(Integer, primary_key=True)
    role_id = Column(Integer, ForeignKey('roles.role_id'), nullable=False)
    nama_lengkap = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    create_at = Column(DateTime, default=func.now())
    
    # Relationships
    role = relationship("Roles", back_populates="users")
    orders = relationship("Orders", back_populates="user")
    keranjangs = relationship("Keranjang", back_populates="user")
    
    def to_dict(self):
        return {
            'user_id': self.user_id,
            'role_id': self.role_id,
            'nama_lengkap': self.nama_lengkap,
            'email': self.email,
            'is_active': self.is_active,
            'create_at': self.create_at.isoformat() if self.create_at else None,
            'role': self.role.to_dict() if self.role else None
        }


class Orders(Base):
    """Model untuk orders"""
    __tablename__ = 'orders'
    
    order_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    status = Column(String(50), default='pending')
    total_harga = Column(Integer, nullable=False)
    pembayaran = Column(String(50))
    create_at = Column(DateTime, default=func.now())
    
    # Relationships
    user = relationship("Users", back_populates="orders")
    order_details = relationship("OrderDetails", back_populates="order")
    keranjangs = relationship("Keranjang", back_populates="order")
    
    def to_dict(self):
        return {
            'order_id': self.order_id,
            'user_id': self.user_id,
            'status': self.status,
            'total_harga': self.total_harga,
            'pembayaran': self.pembayaran,
            'create_at': self.create_at.isoformat() if self.create_at else None,
            'user': self.user.to_dict() if self.user else None,
            'order_details': [od.to_dict() for od in self.order_details] if self.order_details else []
        }


class OrderDetails(Base):
    """Model untuk order details"""
    __tablename__ = 'orderdetails'
    
    detail_id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey('orders.order_id'), nullable=False)
    menu_id = Column(Integer, ForeignKey('menu.menu_id'), nullable=False)
    jumlah = Column(Integer, nullable=False)
    subtotal = Column(Integer, nullable=False)
    
    # Relationships
    order = relationship("Orders", back_populates="order_details")
    menu = relationship("Menu", back_populates="order_details")
    
    def to_dict(self):
        return {
            'detail_id': self.detail_id,
            'order_id': self.order_id,
            'menu_id': self.menu_id,
            'jumlah': self.jumlah,
            'subtotal': self.subtotal,
            'menu': self.menu.to_dict() if self.menu else None
        }


class Keranjang(Base):
    """Model untuk keranjang belanja"""
    __tablename__ = 'keranjang'
    
    keranjang_id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey('orders.order_id'))
    menu_id = Column(Integer, ForeignKey('menu.menu_id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    jumlah = Column(Integer, nullable=False)
    subtotal = Column(Integer, nullable=False)
    
    # Relationships
    order = relationship("Orders", back_populates="keranjangs")
    menu = relationship("Menu", back_populates="keranjangs")
    user = relationship("Users", back_populates="keranjangs")
    
    def to_dict(self):
        return {
            'keranjang_id': self.keranjang_id,
            'order_id': self.order_id,
            'menu_id': self.menu_id,
            'user_id': self.user_id,
            'jumlah': self.jumlah,
            'subtotal': self.subtotal,
            'menu': self.menu.to_dict() if self.menu else None,
            'user': self.user.to_dict() if self.user else None
        }