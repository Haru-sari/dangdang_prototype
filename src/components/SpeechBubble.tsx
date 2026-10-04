export function SpeechBubble({ text }: { text: string }) {
  return (
    <div className="bubble" role="status">
      {text}
    </div>
  );
}
