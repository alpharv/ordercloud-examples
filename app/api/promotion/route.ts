import { NextRequest, NextResponse } from "next/server";
import { LineItem, Order, Promotion } from "ordercloud-javascript-sdk";

export interface PromotionIntegrationPayload extends NextRequest {
    Environment: string,
    Order: Order, 
    LineItems: LineItem[],
    PromosApplied: Promotion[], 
    PromosRequested: Promotion[], 
}

export interface AcceptedPromo {
    ID: string,
    LineItemID?: string, 
    Amount: number
}

export interface RejectedPromo {
    ID: string,
    LineItemID?: string, 
    Reason: string
}

export interface PromotionIntegrationResponse extends NextResponse {
    HttpStatusCode: number,
    PromosAccepted: AcceptedPromo[], 
    PromosRejected: RejectedPromo[], 
    UnhandledErrorBody: string
}

export async function POST(request: NextRequest) {
    try {
        const promotionPayload: PromotionIntegrationPayload = await request.json();
        const promotionResponse: PromotionIntegrationResponse = {} as PromotionIntegrationResponse;
        promotionPayload.PromosRequested.forEach(promo => {
            if (promo.ID==='ext-promo') {
                // Calculate the discount amount
                // Get Number of items in "women" category
                let discountAmount = 0;
                const womenItems = promotionPayload.LineItems.filter(li => li.ProductID.startsWith('womens-'));
                let womenItemsCount = 0;
                womenItems.forEach(wi => womenItemsCount += (wi.Quantity!=undefined ? wi.Quantity : 0));
                if (womenItemsCount >= 2) {
                    // Get Number of items in "mens" category
                    const menItems = promotionPayload.LineItems.filter(li => li.ProductID.startsWith('mens-'));
                    let menItemsCount = 0;
                    menItems.forEach(mi => menItemsCount += (mi.Quantity!=undefined ? mi.Quantity : 0));
                    // For each 2 items in Women's category...
                    const numberOfDiscounts = Math.floor(womenItemsCount / 2);
                    // Get all products in the mens category, and order then by price
                    const menItemsSorted = menItems.sort((a, b) => (a.UnitPrice!=undefined && b.UnitPrice!=undefined) ? a.UnitPrice - b.UnitPrice : 0);
                    let discountLoopCounter = numberOfDiscounts * 2;
                    while(discountLoopCounter > 0) {
                        // Apply the discount to the least expensive
                        const menItemsSortedElement = menItemsSorted.shift();
                        if(menItemsSortedElement!= undefined && menItemsSortedElement.Quantity!= undefined && menItemsSortedElement.UnitPrice != undefined) {
                            if(discountLoopCounter>=menItemsSortedElement.Quantity) { 
                                discountAmount += menItemsSortedElement.UnitPrice * menItemsSortedElement.Quantity * 0.5;
                                discountLoopCounter -= menItemsSortedElement.Quantity;
                            } 
                            else
                            {
                                discountAmount += menItemsSortedElement.UnitPrice * discountLoopCounter * 0.5;
                                discountLoopCounter -= discountLoopCounter;
                            }                                
                        }
                        else
                            discountLoopCounter--;
                    }
                }
                console.log(`Order.ID=${promotionPayload.Order.ID} | promotionPayloadpromo.ID=${promo.ID} | discountAmount=${discountAmount}`);
                promotionResponse.HttpStatusCode = 200;
                promotionResponse.PromosAccepted =  [ 
                    {
                        ID: promo.ID,                        
                        Amount: discountAmount
                    }];
                promotionResponse.PromosRejected = [];
                promotionResponse.UnhandledErrorBody = '';
            }
        });  
        return Response.json(promotionResponse);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid request data' },
            { status: 400 }
        );
    }
}