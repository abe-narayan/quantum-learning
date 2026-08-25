import { getAllLessonsMeta } from "@/lib/content/lessons";
import { PILLARS, getCoursesByPillar } from "@/lib/content/curriculum";
import { ContinueLearningClient, type OrderedLesson } from "./ContinueLearningClient";

/**
 * Server-side half of the "continue learning" widget: builds the full
 * curriculum in its intended reading order (pillar, then course, then
 * module, then in-module lesson order) so the client half only has to pick
 * a spot in an already-ordered list — it never needs to touch the
 * filesystem-backed lesson loader itself.
 */
export async function ContinueLearning() {
  const allLessons = await getAllLessonsMeta();

  const orderedCourses = PILLARS.flatMap((pillar) => getCoursesByPillar(pillar.slug));

  const ordered: OrderedLesson[] = [];
  for (const course of orderedCourses) {
    const moduleIndex = new Map(course.modules.map((module, index) => [module.slug, index]));
    const courseLessons = allLessons
      .filter((lesson) => lesson.course === course.slug)
      .sort((a, b) => {
        const moduleDelta = (moduleIndex.get(a.module) ?? 0) - (moduleIndex.get(b.module) ?? 0);
        return moduleDelta !== 0 ? moduleDelta : a.order - b.order;
      });

    for (const lesson of courseLessons) {
      ordered.push({ slug: lesson.slug, title: lesson.title, courseTitle: course.title });
    }
  }

  return <ContinueLearningClient lessons={ordered} />;
}
