import ReportForm from "./ReportForm";

export default async function ReportContentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ReportForm id={id} />;
}