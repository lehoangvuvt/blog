import CollectionReader from "./components/collection-reader";

const mockCollection = {
  id: "design-thinking-collection",
  title: "Design Thinking & Product Strategy",
  description:
    "A curated reading journey about product intuition, UX psychology, systems thinking, and startup execution.",
  posts: [
    {
      id: 1,
      title: "Why Great Products Feel Invisible",
      slug: "why-great-products-feel-invisible",
      subTitle:
        "The best interfaces disappear and let users focus on outcomes.",
      thumbnailImage:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
      htmlContent: `
        <h2>Introduction</h2>
        <p>Invisible products reduce friction between intention and action.</p>
        <h2>Frictionless UX</h2>
        <p>Users should never need to think about your interface.</p>
        <h2>Conclusion</h2>
        <p>Great design feels effortless.</p>
      `,
    },
    {
      id: 2,
      title: "Building Taste as a Product Engineer",
      slug: "building-taste-as-a-product-engineer",
      subTitle:
        "Technical skill matters, but product taste creates differentiation.",
      thumbnailImage:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
      htmlContent: `
        <h2>Product Taste</h2>
        <p>Taste is pattern recognition developed over years.</p>
        <h2>Learning from Great Products</h2>
        <p>Study Apple, Linear, Notion, and Airbnb deeply.</p>
        <h2>Final Thoughts</h2>
        <p>Engineers with product taste become force multipliers.</p>
      `,
    },
  ],
};

export default async function CollectionPage({
  searchParams,
}: {
  params: Promise<{ collectionId: string }>;
  searchParams: Promise<{ post?: string }>;
}) {
  const { post } = await searchParams;

  return (
    <main className="min-h-screen bg-[#0f0f0f] pb-32 text-neutral-100">
      <CollectionReader
        collection={mockCollection}
        currentPostId={post ? Number(post) : undefined}
      />
    </main>
  );
}
