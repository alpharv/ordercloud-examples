import { IntegrationRequest } from "@/types/ordercloud/requestBodies";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    const integrationRequest: IntegrationRequest = await request.json();

    switch (request.method) {
    case "POST": 
        if (process.env.REACT_APP_LOGGING === "true") {
            console.log('Order calculate:: OrderID=' + integrationRequest.OrderWorksheet.Order?.ID + ' | Email=' + integrationRequest.OrderWorksheet.Order?.FromUser?.Email);
        }
        // TODO: Add logic here - calculate the order total and return it.
        // This is where you want to calculate taxes, shipping, discounts, etc. if you are not using the OrderCloud pricing engine - or just want to override it.
    break; 

    default:
        console.log('!Order calculate:: OrderID=' + integrationRequest.OrderWorksheet.Order?.ID + ' | Email=' + integrationRequest.OrderWorksheet.Order?.FromUser?.Email);
        return Response.json(JSON.parse('{"result":"Default! OK! (ordercalculate)"}'), { status: 200 })
    } 

    return NextResponse.json(
        {
            result: "OK"
        },
        { status: 200 }
     );
}



