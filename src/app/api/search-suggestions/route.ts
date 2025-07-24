import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';
    const limit = parseInt(searchParams.get('limit') || '10');


    // Fetch industry classifications and services data in parallel
    const [industriesSnapshot, servicesSnapshot] = await Promise.all([
      getDocs(collection(db, 'industry_classifications')),
      getDocs(collection(db, 'industry_services'))
    ]);

    const suggestions: Array<{
      id: string;
      text: string;
      type: 'industry' | 'service';
      level?: number; // Only industries have levels
      popular_code?: string; // For search reference
    }> = [];

    // Process industry classifications data - only from specified fields
    industriesSnapshot.docs.forEach(doc => {
      const data = doc.data();
      
      // Check division_title
      if (data.division_title) {
        const divisionTitle = data.division_title.toLowerCase();
        if (divisionTitle.includes(query)) {
          suggestions.push({
            id: `${doc.id}_division`,
            text: data.division_title,
            type: 'industry',
            level: 1,
            popular_code: data.popular_code
          });
        }
      }
      
      // Check subdivision_title
      if (data.subdivision_title) {
        const subdivisionTitle = data.subdivision_title.toLowerCase();
        if (subdivisionTitle.includes(query)) {
          suggestions.push({
            id: `${doc.id}_subdivision`,
            text: data.subdivision_title,
            type: 'industry',
            level: 2,
            popular_code: data.popular_code
          });
        }
      }
      
      // Check popular_name
      if (data.popular_name) {
        const popularName = data.popular_name.toLowerCase();
        if (popularName.includes(query)) {
          suggestions.push({
            id: `${doc.id}_popular`,
            text: data.popular_name,
            type: 'industry',
            level: 3,
            popular_code: data.popular_code
          });
        }
      }
    });

    // Process services data
    servicesSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.service_name) {
        const serviceName = data.service_name.toLowerCase();
        if (serviceName.includes(query)) {
          suggestions.push({
            id: doc.id,
            text: data.service_name,
            type: 'service',
            popular_code: data.popular_code
          });
        }
      }
    });

    // Sort by relevance and limit results
    const sortedSuggestions = suggestions
      .sort((a, b) => {
        // Prioritize exact matches or those starting with the query
        const aText = a.text.toLowerCase();
        const bText = b.text.toLowerCase();
        
        const aStartsWith = aText.startsWith(query);
        const bStartsWith = bText.startsWith(query);
        
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        
        // Then sort by type (industries first)
        if (a.type !== b.type) {
          return a.type === 'industry' ? -1 : 1;
        }
        
        // Finally by alphabetical order
        return aText.localeCompare(bText);
      })
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      query,
      suggestions: sortedSuggestions,
      total: sortedSuggestions.length
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}