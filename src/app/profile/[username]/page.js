import UserProfile from "./profile";

export default function UserProfilePage({ params }) {
  return <UserProfile username={params.username} />;
}
