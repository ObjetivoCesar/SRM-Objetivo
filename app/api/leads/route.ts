import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const cookieStore = cookies();
  const simpleSession = cookieStore.get('crm_session')?.value;

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user && simpleSession !== 'admin') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user?.id;

  try {
    const body = await request.json();
    const {
      businessName,
      contactName,
      phone,
      email,
      address,
      business_location,
      businessActivity,
      relationship_type,
      interestedProduct,
      quantifiedProblem,
      conservativeGoal,
      verbal_agreements,
      years_in_business,
      number_of_employees,
      number_of_branches,
      current_clients_per_month,
      average_ticket,
      known_competition,
      high_season,
      critical_dates,
      facebook_followers,
      other_achievements,
      specific_recognitions,
      personalityType,
      communicationStyle,
      keyPhrases,
      strengths,
      weaknesses,
      opportunities,
      threats,
    } = body;

    const { data, error } = await supabase
      .from("leads")
      .insert([
        {
          business_name: businessName,
          contact_name: contactName,
          phone,
          email,
          address,
          business_location,
          business_activity: businessActivity,
          relationship_type,
          interested_product: interestedProduct,
          quantified_problem: quantifiedProblem,
          conservative_goal: conservativeGoal,
          verbal_agreements,
          years_in_business: years_in_business ? parseInt(years_in_business) : null,
          number_of_employees: number_of_employees ? parseInt(number_of_employees) : null,
          number_of_branches: number_of_branches ? parseInt(number_of_branches) : null,
          current_clients_per_month: current_clients_per_month ? parseInt(current_clients_per_month) : null,
          average_ticket: average_ticket ? parseFloat(average_ticket) : null,
          known_competition,
          high_season,
          critical_dates,
          facebook_followers: facebook_followers ? parseInt(facebook_followers) : null,
          other_achievements,
          specific_recognitions,
          personality_type: personalityType,
          communication_style: communicationStyle,
          key_phrases: keyPhrases,
          strengths,
          weaknesses,
          opportunities,
          threats,
          created_by: userId,
        },
      ])
      .select();

    if (error) {
      console.error("Error creating lead:", error);
      return NextResponse.json({ error: "Failed to create lead", details: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Lead created successfully", data }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/leads:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}