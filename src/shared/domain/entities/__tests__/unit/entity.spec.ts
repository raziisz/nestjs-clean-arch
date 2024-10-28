import { validate as uuidValidate, v4 as uuidV4 } from 'uuid'
import { Entity } from '../../entity'

type StubProps = {
  prop1: string,
  prop2: number
}
class StubEntity extends Entity<StubProps> {

}
describe("Entity unit test", () => {
  it('Should set props and id', () => {
    const props = { prop1: 'value1', prop2: 15 }
    const entity = new StubEntity(props)

    expect(entity.props).toEqual(props)
    expect(entity.id).not.toBeNull()
    expect(uuidValidate(entity.id)).toBeTruthy()
  })

  it('Should accept a valid uuid', () => {
    const props = { prop1: 'value1', prop2: 15 }
    const id = uuidV4()
    const entity = new StubEntity(props, id)

    expect(uuidValidate(entity.id)).toBeTruthy()
    expect(entity.id).toBe(id)
  })

  it('Should convert a entity to a Javascript Object', () => {
    const props = { prop1: 'value1', prop2: 15 }
    const id = uuidV4()
    const entity = new StubEntity(props, id)

    expect(entity.toJSON()).toStrictEqual({
      id,
      ...props
    })
  })
})


