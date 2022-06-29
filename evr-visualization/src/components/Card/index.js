import './style.css'

const Card = ({ children, styleOverride }) => {
  return (
    <div className="card" style={styleOverride} >
      {children}
    </div>
  )
}

export default Card;