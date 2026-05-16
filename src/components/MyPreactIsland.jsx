import { useState } from 'preact/hooks';

export default function InteractiveButton() {
  const [clickCount, setClickCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    setClickCount(prev => prev + 1);
  };

  return (
    <a href="/"> 
        
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '12px 24px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: isHovered ? '#005BBB' : '#007ACC',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        transition: 'background-color 0.2s',
      }}
    >
      {clickCount > 0 ? `Clicked ${clickCount} times` : 'Click Me'}
    </button>
    </a>
  );
}