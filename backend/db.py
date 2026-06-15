import os
import asyncio
from typing import AsyncGenerator
import asyncpg

# Create a connection pool when the module is imported
_pool: asyncpg.Pool | None = None

async def get_pool() -> asyncpg.Pool:
    global _pool
    if _pool is None:
        DATABASE_URL = os.getenv("DATABASE_URL")
        if not DATABASE_URL:
            raise RuntimeError("DATABASE_URL not set in environment")
        _pool = await asyncpg.create_pool(DATABASE_URL)
    return _pool

async def get_db() -> AsyncGenerator[asyncpg.Connection, None]:
    pool = await get_pool()
    async with pool.acquire() as conn:
        async with conn.transaction():
            yield conn
