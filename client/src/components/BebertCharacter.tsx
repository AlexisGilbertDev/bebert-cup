import SpeechBubble from './SpeechBubble';
import './comic.css';

export default function BebertCharacter() {
  return (
    <div
      style={{
        border: '4px solid var(--ink)',
        borderRadius: 6,
        background: '#fff',
        boxShadow: '5px 5px 0 var(--ink)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'repeating-conic-gradient(from 0deg at 50% 42%, rgba(29,111,224,0) 0deg 8deg, rgba(29,111,224,.1) 8deg 16deg)',
        }}
      />
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          padding: '16px 0 14px',
        }}
      >
        {/* Character 204×196 */}
        <div style={{ position: 'relative', width: 204, height: 196 }}>
          {/* burst */}
          <div
            style={{
              position: 'absolute',
              left: 72,
              top: 40,
              width: 104,
              height: 104,
              transform: 'translate(-50%,-50%)',
              background: '#ffd23f',
              clipPath:
                'polygon(50% 0,60% 20%,82% 12%,78% 35%,100% 45%,80% 56%,92% 80%,67% 73%,58% 98%,46% 76%,22% 88%,28% 64%,4% 58%,24% 46%,10% 24%,34% 30%,40% 6%)',
              zIndex: 1,
            }}
          />
          {/* speed lines */}
          <div
            style={{
              position: 'absolute',
              left: 28,
              top: 12,
              width: 28,
              height: 5,
              background: '#14110d',
              borderRadius: 3,
              transform: 'rotate(38deg)',
              opacity: 0.85,
              zIndex: 6,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 17,
              top: 30,
              width: 20,
              height: 5,
              background: '#14110d',
              borderRadius: 3,
              transform: 'rotate(38deg)',
              opacity: 0.6,
              zIndex: 6,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 44,
              top: 4,
              width: 16,
              height: 5,
              background: '#14110d',
              borderRadius: 3,
              transform: 'rotate(38deg)',
              opacity: 0.5,
              zIndex: 6,
            }}
          />
          {/* jersey */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 0,
              transform: 'translateX(-50%)',
              width: 190,
              height: 64,
              background: '#1f6fe0',
              border: '4px solid #14110d',
              borderRadius: '62px 62px 16px 16px',
              zIndex: 2,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 8,
              bottom: 0,
              width: 56,
              height: 50,
              background: '#1759b8',
              borderRadius: '42px 8px 0 28px',
              zIndex: 2,
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 8,
              bottom: 0,
              width: 56,
              height: 50,
              background: '#1759b8',
              borderRadius: '8px 42px 28px 0',
              zIndex: 2,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 42,
              transform: 'translateX(-50%)',
              width: 62,
              height: 26,
              background: '#fff',
              border: '4px solid #14110d',
              borderRadius: '0 0 32px 32px',
              zIndex: 3,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 4,
              transform: 'translateX(-50%)',
              fontFamily: "'Bangers', sans-serif",
              fontSize: 28,
              color: '#fff',
              WebkitTextStroke: '2px #14110d',
              letterSpacing: 2,
              zIndex: 3,
            }}
          >
            10
          </div>
          {/* neck */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 120,
              transform: 'translateX(-50%)',
              width: 48,
              height: 42,
              background: '#e3a878',
              border: '4px solid #14110d',
              borderRadius: 10,
              zIndex: 3,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 120,
              transform: 'translateX(-50%)',
              width: 48,
              height: 15,
              background: 'rgba(20,17,13,.18)',
              borderRadius: '10px 10px 0 0',
              zIndex: 3,
            }}
          />
          {/* ears */}
          <div
            style={{
              position: 'absolute',
              left: 40,
              top: 92,
              width: 20,
              height: 26,
              background: '#e9b184',
              border: '4px solid #14110d',
              borderRadius: '50%',
              zIndex: 3,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 46,
              top: 99,
              width: 7,
              height: 12,
              background: 'rgba(20,17,13,.16)',
              borderRadius: '50%',
              zIndex: 3,
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 40,
              top: 92,
              width: 20,
              height: 26,
              background: '#dca673',
              border: '4px solid #14110d',
              borderRadius: '50%',
              zIndex: 3,
            }}
          />
          {/* face */}
          <div
            style={{
              position: 'absolute',
              left: 52,
              top: 30,
              width: 96,
              height: 108,
              background: '#efbf97',
              border: '4px solid #14110d',
              borderRadius: '48px 48px 42px 42px',
              zIndex: 4,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 110,
              top: 50,
              width: 34,
              height: 78,
              background: 'rgba(20,17,13,.09)',
              borderRadius: '0 40px 40px 0',
              zIndex: 4,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 62,
              top: 64,
              width: 32,
              height: 22,
              background: 'rgba(255,255,255,.26)',
              borderRadius: '50%',
              zIndex: 4,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 48,
              top: 64,
              width: 14,
              height: 30,
              background: 'rgba(36,26,18,.3)',
              borderRadius: '0 0 0 14px',
              zIndex: 4,
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 48,
              top: 64,
              width: 14,
              height: 30,
              background: 'rgba(36,26,18,.3)',
              borderRadius: '0 0 14px 0',
              zIndex: 4,
            }}
          />
          {/* beard */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 116,
              transform: 'translateX(-50%)',
              width: 74,
              height: 24,
              background: 'rgba(36,26,18,.18)',
              borderRadius: '0 0 40px 40px',
              zIndex: 4,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 56,
              top: 104,
              width: 18,
              height: 24,
              background: 'rgba(36,26,18,.11)',
              borderRadius: '0 0 0 20px',
              zIndex: 4,
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 56,
              top: 104,
              width: 18,
              height: 24,
              background: 'rgba(36,26,18,.11)',
              borderRadius: '0 0 20px 0',
              zIndex: 4,
            }}
          />
          {/* eyebrows */}
          <div
            style={{
              position: 'absolute',
              left: 60,
              top: 86,
              width: 24,
              height: 7,
              background: '#241a12',
              borderRadius: 4,
              transform: 'rotate(7deg)',
              zIndex: 5,
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 60,
              top: 86,
              width: 24,
              height: 7,
              background: '#241a12',
              borderRadius: 4,
              transform: 'rotate(-7deg)',
              zIndex: 5,
            }}
          />
          {/* eyes */}
          <div
            style={{
              position: 'absolute',
              left: 61,
              top: 95,
              width: 21,
              height: 13,
              background: '#fff',
              border: '3px solid #14110d',
              borderRadius: '50%',
              overflow: 'hidden',
              zIndex: 5,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 5,
                top: 0,
                width: 11,
                height: 11,
                background: '#5a3a22',
                borderRadius: '50%',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 8,
                top: 3,
                width: 5,
                height: 5,
                background: '#14110d',
                borderRadius: '50%',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 9,
                top: 2,
                width: 2,
                height: 2,
                background: '#fff',
                borderRadius: '50%',
              }}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              right: 61,
              top: 95,
              width: 21,
              height: 13,
              background: '#fff',
              border: '3px solid #14110d',
              borderRadius: '50%',
              overflow: 'hidden',
              zIndex: 5,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 5,
                top: 0,
                width: 11,
                height: 11,
                background: '#5a3a22',
                borderRadius: '50%',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 8,
                top: 3,
                width: 5,
                height: 5,
                background: '#14110d',
                borderRadius: '50%',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 9,
                top: 2,
                width: 2,
                height: 2,
                background: '#fff',
                borderRadius: '50%',
              }}
            />
          </div>
          {/* nose */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 100,
              width: 9,
              height: 18,
              background: 'rgba(20,17,13,.1)',
              borderRadius: 6,
              zIndex: 5,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 112,
              transform: 'translateX(-50%)',
              width: 16,
              height: 12,
              background: '#e8b083',
              borderRadius: '50%',
              zIndex: 5,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 117,
              transform: 'translate(-150%,0)',
              width: 5,
              height: 4,
              background: '#9c6a45',
              borderRadius: '50%',
              zIndex: 5,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 117,
              transform: 'translate(60%,0)',
              width: 5,
              height: 4,
              background: '#9c6a45',
              borderRadius: '50%',
              zIndex: 5,
            }}
          />
          {/* moustache + mouth */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 120,
              transform: 'translateX(-50%)',
              width: 34,
              height: 7,
              background: 'rgba(36,26,18,.42)',
              borderRadius: 6,
              zIndex: 5,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 125,
              transform: 'translateX(-50%)',
              width: 30,
              height: 10,
              background: '#7a2d2d',
              border: '3px solid #14110d',
              borderRadius: '6px 6px 9px 9px',
              zIndex: 5,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 126,
              transform: 'translateX(-50%)',
              width: 23,
              height: 4,
              background: '#fff',
              borderRadius: 2,
              zIndex: 5,
            }}
          />
          {/* hair */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 26,
              transform: 'translateX(-50%)',
              width: 108,
              height: 44,
              background: '#241a12',
              border: '4px solid #14110d',
              borderRadius: '46px 46px 10px 10px',
              zIndex: 5,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 50,
              top: 30,
              width: 34,
              height: 30,
              background: '#241a12',
              border: '4px solid #14110d',
              borderRadius: '24px 18px 8px 14px',
              zIndex: 5,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 104,
              top: 32,
              width: 32,
              height: 28,
              background: '#241a12',
              border: '4px solid #14110d',
              borderRadius: '18px 24px 14px 8px',
              zIndex: 5,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 74,
              top: 32,
              width: 30,
              height: 9,
              background: '#6a4c2c',
              borderRadius: 8,
              transform: 'rotate(-6deg)',
              opacity: 0.9,
              zIndex: 6,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 62,
              top: 38,
              width: 12,
              height: 7,
              background: '#4a3420',
              borderRadius: 6,
              opacity: 0.8,
              zIndex: 6,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 46,
              top: 50,
              width: 15,
              height: 20,
              background: '#241a12',
              border: '4px solid #14110d',
              borderRadius: '9px 9px 10px 4px',
              transform: 'rotate(-10deg)',
              zIndex: 6,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 57,
              top: 56,
              width: 15,
              height: 24,
              background: '#241a12',
              border: '4px solid #14110d',
              borderRadius: '8px 8px 10px 6px',
              transform: 'rotate(-4deg)',
              zIndex: 6,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 69,
              top: 58,
              width: 16,
              height: 26,
              background: '#241a12',
              border: '4px solid #14110d',
              borderRadius: 8,
              zIndex: 6,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 82,
              top: 57,
              width: 16,
              height: 25,
              background: '#241a12',
              border: '4px solid #14110d',
              borderRadius: '8px 8px 6px 10px',
              transform: 'rotate(4deg)',
              zIndex: 6,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 95,
              top: 51,
              width: 15,
              height: 21,
              background: '#241a12',
              border: '4px solid #14110d',
              borderRadius: '9px 9px 4px 10px',
              transform: 'rotate(10deg)',
              zIndex: 6,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 64,
              top: 70,
              width: 14,
              height: 16,
              background: '#241a12',
              clipPath: 'polygon(50% 100%,0 0,100% 0)',
              zIndex: 6,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 78,
              top: 72,
              width: 14,
              height: 17,
              background: '#241a12',
              clipPath: 'polygon(50% 100%,0 0,100% 0)',
              zIndex: 6,
            }}
          />
          {/* sweat */}
          <div
            style={{
              position: 'absolute',
              right: 48,
              top: 76,
              width: 9,
              height: 13,
              background: '#8fd6ff',
              border: '2px solid #14110d',
              borderRadius: '50% 50% 50% 0',
              transform: 'rotate(45deg)',
              zIndex: 6,
            }}
          />
          {/* ball */}
          <div
            style={{
              position: 'absolute',
              left: 72,
              top: 40,
              width: 52,
              height: 52,
              transform: 'translate(-50%,-50%)',
              background: '#fff',
              border: '4px solid #14110d',
              borderRadius: '50%',
              boxShadow: 'inset -6px -6px 0 rgba(20,17,13,.08)',
              overflow: 'hidden',
              zIndex: 7,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%,-50%)',
                width: 16,
                height: 16,
                background: '#14110d',
                clipPath: 'polygon(50% 0,100% 38%,82% 100%,18% 100%,0 38%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: -3,
                top: 5,
                width: 14,
                height: 14,
                background: '#14110d',
                clipPath: 'polygon(50% 0,100% 38%,82% 100%,18% 100%,0 38%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: -2,
                bottom: 1,
                width: 13,
                height: 13,
                background: '#14110d',
                clipPath: 'polygon(50% 0,100% 38%,82% 100%,18% 100%,0 38%)',
              }}
            />
          </div>
        </div>
        {/* speech bubble */}
        <div style={{ position: 'absolute', right: 10, top: 6 }}>
          <SpeechBubble>La tête&nbsp;!!</SpeechBubble>
        </div>
      </div>
    </div>
  );
}
