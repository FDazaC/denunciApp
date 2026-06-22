import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
  onClick?: () => void;
}

export default function BackButton({
  to = "/inicio",
  label = "Volver al inicio",
  className = "",
  onClick,
}: BackButtonProps) {
  const navigate = useNavigate();

  function handleClick() {
    if (onClick) {
      onClick();
      return;
    }

    if (to) {
      navigate(to);
      return;
    }

    navigate(-1);
  }

  return (
    <button type="button" onClick={handleClick} className={`btn-back ${className}`.trim()}>
      <span className="btn-back-icon">←</span>
      {label}
    </button>
  );
}
