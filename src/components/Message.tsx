import { useEffect, useState } from 'react';

type Props = {
  msg: string;
  type: 'success' | 'error' | 'info';
  duration?: number; // duração em ms (opcional)
};

const typeStyles = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-blue-500 text-white',
};

const Message = ({ msg, type, duration = 5000 }: Props) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div
      className={`
        fixed top-6 right-6 z-50 px-6 py-3 rounded shadow-lg font-semibold transition-all
        ease-in-out animate-bounce
        ${typeStyles[type]}
        ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}
        duration-1350
      `}
      style={ msg.length > 50 ? { width: '400px' } : { width: 'auto' } }
    >
      <p>{msg}</p>
    </div>
  );
};

export default Message;