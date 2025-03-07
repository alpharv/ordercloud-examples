import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    
    const input = await request.body?.getReader().read();
    const decoder = new TextDecoder();
    const string = decoder.decode(input?.value);
    const data = JSON.parse(string);
    console.log('data:', data);

    return Response.json(JSON.parse('{"result":"Default! OK!"}'), { status: 200 })
}

