/* eslint-disable @typescript-eslint/no-explicit-any */
import { RefereeResource, RefereeCourse, RefereeNotice } from "@/types";
import { directusFetch } from "@/lib/directus/fetch";

export async function getRefereeResources(): Promise<RefereeResource[]> {
  try {
    if (process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      const response = await directusFetch<any>('referee_resources');
      if (response && response.length > 0) {
        return response.map((res: any) => ({
          title: res.title,
          category: res.category || "laws",
          size: res.size || "Unknown",
          downloadUrl: res.file ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${res.file}` : (res.download_url || "#")
        }));
      }
    }
  } catch (error) {
    console.warn("Directus fetch failed for referee resources:", error);
  }

  return [];
}

export async function getRefereeCourses(): Promise<RefereeCourse[]> {
  try {
    if (process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      const response = await directusFetch<any>('referee_courses', {
        sort: ['date_label']
      });
      if (response && response.length > 0) {
        return response.map((course: any) => ({
          title: course.title,
          level: course.level || "Standard",
          date: course.date_label || new Date(course.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).toUpperCase(),
          venue: course.venue || "TBA",
          instructor: course.instructor || "TBA",
          status: course.status || "open"
        }));
      }
    }
  } catch (error) {
    console.warn("Directus fetch failed for referee courses:", error);
  }

  return [];
}

export async function getRefereeNotices(): Promise<RefereeNotice[]> {
  try {
    if (process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      const response = await directusFetch<any>('referee_notices', {
        sort: ['-date_label']
      });
      if (response && response.length > 0) {
        return response.map((notice: any) => ({
          id: String(notice.id),
          title: notice.title,
          date: notice.date_label || new Date(notice.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).toUpperCase(),
          excerpt: notice.excerpt || "",
          content: notice.content || ""
        }));
      }
    }
  } catch (error) {
    console.warn("Directus fetch failed for referee notices:", error);
  }

  return [];
}
