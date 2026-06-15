import os
import asyncio
import asyncpg
from dotenv import load_dotenv

async def main():
    load_dotenv(os.path.join(os.path.dirname(__file__), '.env.local'))
    url = os.getenv("DATABASE_URL")
    print("Connecting to:", url)
    try:
        conn = await asyncpg.connect(url)
        print("Successfully connected!")
        rows = await conn.fetch("SELECT * FROM users LIMIT 5")
        print("Users:", rows)
        await conn.close()
    except Exception as e:
        print("Error:", e)

asyncio.run(main())
