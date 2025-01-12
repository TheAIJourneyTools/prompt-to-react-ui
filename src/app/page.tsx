import DynamicRender from '@/components/DynamicRender';

const apiKey = process.env.VITE_GEMINI_API_KEY;

export default function Home() {
  return (
    <div>
      <div>
        <DynamicRender apiKey={apiKey} />
      </div>
    </div>
  );
}
