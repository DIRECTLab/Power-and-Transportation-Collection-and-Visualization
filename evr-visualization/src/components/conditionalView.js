const ConditionalView = ({visible, children}) => {
  if (!visible)
    return null;
  return (
    <>
      {children}
    </>
  )
}

export default ConditionalView;