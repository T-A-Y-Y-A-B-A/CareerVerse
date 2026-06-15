import httpx
import asyncio

async def test():
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get("http://localhost:11434/api/tags")
            print("Ollama response:", res.status_code, res.json())
    except Exception as e:
        print("Ollama connection failed:", e)

asyncio.run(test())
