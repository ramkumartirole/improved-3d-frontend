// hooks/useLilGuiPosition.js
import { useEffect, useState } from 'react';
import GUI from 'lil-gui';

export const useLilGuiPosition = (isVisible, defaultPosition = [0, 0, 0], label = 'Model') => {
  const [position, setPosition] = useState(defaultPosition);

  useEffect(() => {
    if (!isVisible) return;

    const gui = new GUI({ title: label });
    const pos = { x: position[0], y: position[1], z: position[2] };

    gui.add(pos, 'x', -5, 5).onChange((val) => setPosition((prev) => [val, prev[1], prev[2]]));
    gui.add(pos, 'y', -5, 5).onChange((val) => setPosition((prev) => [prev[0], val, prev[2]]));
    gui.add(pos, 'z', -5, 5).onChange((val) => setPosition((prev) => [prev[0], prev[1], val]));

    return () => gui.destroy();
  }, [isVisible]);

  return (position);
};
