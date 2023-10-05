function UserCard({ name, age, birth }) {
  const safeName = name;

  return (
    <>
      <div safe={''} test="aa">{birth.toISOString()}{1+1}</div>
      <h1>
        <div safe>{'aa'}</div>
      </h1>
      <h3>aaa</h3>
    </>
  )
}