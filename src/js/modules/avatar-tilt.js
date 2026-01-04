/**
 * AvatarTilt - 3D Tilt effect for the hyper-avatar component
 */
export function initAvatarTilt() {
  const avatar = document.getElementById("avatar-sprite");
  if (!avatar) return;

  const handleMouseMove = (e) => {
    const rect = avatar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate tilt (limit to +/- 10 degrees)
    const tiltX = (y - centerY) / centerY * 10;
    const tiltY = (centerX - x) / centerX * 10;
    
    avatar.style.setProperty("--avatar-tilt-x", `${tiltY}deg`);
    avatar.style.setProperty("--avatar-tilt-y", `${-tiltX}deg`);
    avatar.style.setProperty("--avatar-translate", `-5px`);
    avatar.style.setProperty("--avatar-glow-strength", `0.8`);
    avatar.style.setProperty("--avatar-highlight", `40%`);
  };

  const handleMouseLeave = () => {
    avatar.style.setProperty("--avatar-tilt-x", `0deg`);
    avatar.style.setProperty("--avatar-tilt-y", `0deg`);
    avatar.style.setProperty("--avatar-translate", `0px`);
    avatar.style.setProperty("--avatar-glow-strength", `0.55`);
    avatar.style.setProperty("--avatar-highlight", `48%`);
  };

  avatar.addEventListener("mousemove", handleMouseMove);
  avatar.addEventListener("mouseleave", handleMouseLeave);
}
