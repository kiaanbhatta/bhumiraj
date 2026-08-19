import { Link, createFileRoute } from "@tanstack/react-router";

import { SmartImage } from "@/components/common/Media";
import { EmptyState, ListSkeleton } from "@/components/common/States";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { useNewsArticle } from "@/lib/queries";

export const Route = createFileRoute("/news/$slug")({
  head: () => ({
    meta: [
      { title: "Article — Bhumiraj Computer Institute" },
      { name: "description", content: "Read the latest article from Bhumiraj Computer Institute." },
      { property: "og:title", content: "Article — Bhumiraj Computer Institute" },
      { property: "og:description", content: "News and announcements from the institute." },
    ],
  }),
  component: NewsArticle,
});

function NewsArticle() {
  const { slug } = Route.useParams();
  const { data: article, isLoading } = useNewsArticle(slug);

  return (
    <PublicLayout>
      <article className="container-page max-w-3xl py-12">
        {isLoading ? (
          <ListSkeleton rows={5} />
        ) : !article ? (
          <EmptyState
            title="Article not found"
            action={
              <Button asChild variant="outline">
                <Link to="/news">Back to news</Link>
              </Button>
            }
          />
        ) : (
          <>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary">{article.category}</Badge>
              <span>{formatDate(article.published_at)}</span>
              <span>· {article.author}</span>
            </div>
            <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{article.title}</h1>
            <p className="mt-4 text-base text-muted-foreground">{article.excerpt}</p>
            {article.cover_image_url ? (
              <SmartImage
                src={article.cover_image_url}
                alt={article.title}
                className="mt-8 h-72 w-full rounded-3xl object-cover"
              />
            ) : null}
            <div className="mt-8 whitespace-pre-line text-sm leading-relaxed text-foreground/85 sm:text-base">
              {article.content}
            </div>
            <Button asChild variant="outline" className="mt-10 rounded-full">
              <Link to="/news">Back to all news</Link>
            </Button>
          </>
        )}
      </article>
    </PublicLayout>
  );
}
