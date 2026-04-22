import { TagsService } from "@/api/tagApi";
import { serverAuthProvider } from "@/lib/authProvider";
import { notFound } from "next/navigation";

export default async function TagDetailPage(props: { params: Promise<{ id: long }> }) {
  const params = await props.params;
  console.log("PAGE EXECUTED");
  const id = await params.id;
  console.log(id)
  if (!id) {
    notFound();
  }

  const service = new TagsService(serverAuthProvider);

  const tag = await service.findById(id);

  if (!tag) {
    notFound();
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">
        Tag: {tag.name}
      </h1>

      {tag.description && (
        <p className="text-gray-600 mt-2">
          {tag.description}
        </p>
      )}
    </div>
  );
}