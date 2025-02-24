import type { APIEvent } from '@solidjs/start/server'
import { addSportsCenter, getSportsCenters, removeSportCenter } from '~/lib/sportsCenters'

export async function GET(event: APIEvent) {
  try {
    const sports = await getSportsCenters();
    return new Response(JSON.stringify(sports), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: "Failed to fetch sports centers",
        error: error.message || String(error),
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

export async function POST(event: APIEvent) {
  try {
    const formData = await event.request.formData();
    const newSport = await addSportsCenter(formData);
    return new Response(JSON.stringify(newSport), {
      headers: { 'Content-Type': 'application/json' },
      status: 201,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: "Failed to add sports center",
        error: error.message || String(error),
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

export async function DELETE(event: APIEvent) {
  const id = Number(event.params.id);
  if (isNaN(id)) {
    return new Response(
      JSON.stringify({ message: "Invalid ID" }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 }
    );
  }
  try {
    await removeSportCenter(id);
    return new Response(
      JSON.stringify({ message: "Sports center deleted" }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: "Failed to delete sports center",
        error: error.message || String(error),
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}