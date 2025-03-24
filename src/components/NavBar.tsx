interface NavBarProps {
  title: string;
}

export default function NavBar({ title }: NavBarProps) {
  return (
    <div className="nav-bar">
      <h1>{title}</h1>
    </div>
  );
} 