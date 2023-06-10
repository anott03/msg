import { revalidatePath } from "next/cache";

// https://feathericons.dev/?search=user&iconset=feather&format=strict-tsx
function UserIcon(props: JSX.IntrinsicElements["svg"]) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" {...props}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

function User() {
    return (
        <div className="p-1 rounded-[50%] bg-gray-200 w-[40px] h-[40px] m-[5px] flex flex-row justify-center items-center">
            <UserIcon />
        </div>
    );
}

export default async function Home() {
    const { messages } = await fetch("http://localhost:8787/messages").then(res => res.json());

    return (
        <main className="w-screen h-screen flex flex-row justify-center items-center">
            <div className="border-l border-r border-gray-300 w-full max-w-[700px] bg-red h-full flex flex-col">
                <div className="p-3 w-full border-b border-gray-300">
                    <h1 className="text-xl font-bold">Little Message Thing</h1>
                    <form className="flex flex-col items-end" action={async (formData: FormData) => {
                        "use server";
                        const message = formData.get("inpt");
                        const timestamp = Date.now();
                        await fetch("http://localhost:8787/messages", {
                            method: "POST",
                            body: JSON.stringify({ message, timestamp }),
                            headers: {
                                "Content-Type": "application/json",
                            }
                        });
                        revalidatePath("/");
                    }}>
                        <input name="inpt" type="text" className="w-full mt-3 focus:outline-none" placeholder="speak your mind..." />
                        <button className="px-3 py-1 bg-violet-500 rounded-2xl text-white hover:bg-violet-600" type="submit">Send</button>
                    </form>
                </div>
                <div className="w-full h=full flex flex-col overflow-y-auto">
                    {messages.map(({ message, timestamp }: { message: string, timestamp: number }) => {
                        const ts = new Date(timestamp);
                        return (<div key={timestamp} className="w-full p-3">
                            <div className="w-full flex flex-row gap-2 items-">
                                <User />
                                <div>
                                    <span className="flex flex-row gap-3 items-center"><p className="font-bold">Anonymous</p><small>{ts.toLocaleString()}</small></span>
                                    <p className="text-md">{message}</p>
                                </div>
                            </div>
                        </div>);
                    })}
                </div>
            </div>
        </main>
    )
}
