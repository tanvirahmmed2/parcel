export async function generateMetadata({ params }) {
  const { trackingId } = await params;
  return {
    title: `Track Parcel #${trackingId.toUpperCase()} | Parcel`,
  };
}
export default function TrackerLayout({ children }) {
  return children;
}
