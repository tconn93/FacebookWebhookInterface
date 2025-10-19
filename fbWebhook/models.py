from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, BigInteger
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class UserPage(Base):
    __tablename__ = 'user_pages'
    id = Column(Integer, primary_key=True, index=True)
    fb_page_id = Column(String, unique=True, index=True)  # Facebook Page ID
    access_token = Column(String)  # Long-lived Page access token
    webhook_url = Column(String)   # URL to send webhooks to
    last_post_time = Column(BigInteger, default=0)  # UNIX timestamp of last fetched post
    posts = relationship("PagePost", back_populates="page")

class PagePost(Base):
    __tablename__ = 'page_posts'
    id = Column(Integer, primary_key=True, index=True)
    fb_post_id = Column(String, unique=True, index=True)  # Facebook Post ID
    page_id = Column(Integer, ForeignKey('user_pages.id'))
    message = Column(String, nullable=True)
    created_time = Column(BigInteger)  # UNIX timestamp
    page = relationship("UserPage", back_populates="posts")