import './App.css'
import Map from './map.jsx'
import { useState } from 'react'


function App() {
  const [donateOpen, setDonateOpen] = useState(false)
  const [selectedSpot, setSelectedSpot] = useState(null)

  const handleDonateClick = (e) => {
    e.preventDefault()
    setDonateOpen(true)
  }

  const closeDonate = () => setDonateOpen(false)
  const closeSpotPanel = () => setSelectedSpot(null)
  const handleSpotClick = (spot) => {
    setSelectedSpot(spot)
  }

  return (
    <div className="layout">
      <header className="sidebar">
        <img src="/skateIcon.svg" alt="Sk8Map logo" className="bigLogo" />
        <nav className="navBar">
          <a href="#"  title="Who we are"><img src="/Info.svg" alt="" className='navBtn logo
          '/></a>
          <a href="#" title="Submit your skatepark/spot"><img src="/submitSkate.svg" alt="submit spot" className='logo navBtn'/></a>
          <a title="Donate!" onClick={handleDonateClick}><img src="/donate.svg" alt="donate" className='logo donate navBtn'/></a>
        </nav>
      </header>
      <main className="content">
        <Map onSpotClick={handleSpotClick} />
        {selectedSpot && (
          <div className="spot-panel" role="dialog" aria-modal="false" aria-labelledby="spot-title">
            <div className="spot-panel-header">
              <h2 id="spot-title">{selectedSpot.name || 'Unnamed spot'}</h2>
              <button className="close-btn" aria-label="Close" onClick={closeSpotPanel}>×</button>
            </div>
            <div className="spot-panel-body">
              <p className="spot-subtitle">{selectedSpot.skatepark ? 'Skatepark' : 'Spot'}</p>
              {selectedSpot.userSubmited ? (
                <p className="spot-submitter">Submitted by {selectedSpot.userSubmited}</p>
              ) : null}
              {Array.isArray(selectedSpot.modules) && selectedSpot.modules.length > 0 ? (
                <div className="spot-modules">
                  {selectedSpot.modules.map((m, i) => (
                    <span className="spot-tag" key={i}>{m}</span>
                  ))}
                </div>
              ) : (
                <p>No modules listed.</p>
              )}
            </div>
          </div>
        )}
      </main>

      {donateOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="donate-title" onClick={closeDonate}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 id="donate-title">Support Sk8Map</h2>
              <button className="close-btn" aria-label="Close" onClick={closeDonate}>×</button>
            </div>
            <div className="modal-body">
              <p>Hey everyone! 👋

We’re a group of skaters who love discovering new places to ride and we wanted to make it easier for everyone to do the same. <br/><br/> That’s why we’re building a community-driven skate map 🌍 where skaters can share and explore skateparks, street spots, and DIY spots all around the world.<br/><br/>

The map is 100% free and powered entirely by the community skaters submitting their favorite spots so others can find them. We don’t make any money from it it’s just something we’re passionate about and want to keep alive for everyone who loves skating as much as we do. 🖤<br/><br/>

If you like what we’re doing and want to help us keep the project rolling you can donate by clicking in the button below! Every little bit goes toward maintenance, and continuing to improve the platform.<br/><br/>

Thanks for supporting the scene and helping us keep skating connected!<br/><br/>

Keep pushing,<br/><br/>
– The Skate Map Team</p>
            </div>
            <div className="modal-actions">
              <a className="donate-btn" href="https://www.paypal.com/paypalme/charlossus">Donate via PayPal</a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App