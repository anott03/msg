import { Router } from 'itty-router'
import { v4 as uuid } from 'uuid';
import { handleCors, handleCorsOptions } from "./cors";

const router = Router();

router.get("/", (request) => {
    return new Response(JSON.stringify({
        message: "hello, world!"
    }), {
        headers: {
            ...handleCors(request),
            'Content-Type': 'application/json',
        }
    })
})

router.get("/messages", async (request) => {
    const messages = JSON.parse(await FORUM_DB.get("messages")) || [];
    return new Response(JSON.stringify({ messages }), {
        headers: {
            ...handleCors(request),
            'Content-Type': 'application/json',
        },
    });
});

/**
* @type {(request: Request) => Response}
*/
const newMessageHandler = async (request) => {
    /**
    * @type {{message: string, timestamp: number}}
    */
    let { message, timestamp } = await request.json();
    if (message) {
        message = message.trim();
        if (message !== "") {
            /**
            * @type {{id: string, message: string, timestamp: number}[]}
            */
            const messages = JSON.parse(await FORUM_DB.get("messages")) || [];
            await FORUM_DB.put("messages", JSON.stringify([{ id: uuid(), message, timestamp }, ...messages]));
        }
    }
    return new Response(null, {
        headers: handleCors(request),
    });
};
router.post("/messages", newMessageHandler);

router.options("*", handleCorsOptions());
router.all("*", () => new Response("404, not found!", { status: 404 }))

addEventListener('fetch', (e) => {
    e.respondWith(router.handle(e.request))
})
