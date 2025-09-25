import React from 'react'

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        color: 'white',
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '3rem',
        borderRadius: '1rem',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          BookFinder 📚
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          Deployment Test - Success! 🎉
        </p>
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          padding: '1.5rem',
          borderRadius: '0.5rem'
        }}>
          <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
            ✅ React is working perfectly!
          </p>
          <p style={{ marginTop: '0.5rem', opacity: '0.9' }}>
            JavaScript modules loaded correctly
          </p>
        </div>
      </div>
    </div>
  )
}

export default App