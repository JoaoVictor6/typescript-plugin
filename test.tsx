function UserCard({ name, age, birth }) {
  const safeName = name;
  const shouldEscape = <h1>{name}</h1>

  return (
    <>
      {/* // this line works as normal
      <h1 safe>{name}</h1>
      // this line emits a warning of unsanitized user input
      <h1>{name}</h1>
      // this line should not emit warnings because variable starts with safe keyword
      <h1>{safeName}</h1>
      // this line emits warnings because safe was used on a non pure string child */}
      <div safe>
        <h1>{name}</h1>
      </div>
      {/* // this line should not emit warnings because inner html was extracted to another variable
      <h1 safe={true}>{shouldEscape}</h1>
      // this line should not emit warnings because age isn't of type string
      // this line should not emit warnings because its variable isnt of type string,
      // (even if there are methods called)
    <div>{birth.toISOString()}</div> */}
    <div>age</div>
    </>
  )
}