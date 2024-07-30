import { VariableInstance } from '../model/variable';
import { ListItemInstance } from '../model/listItem';
import repository from '../model';

beforeAll(async () => {
  repository.connect({ url:'sqlite:memory', options: { logging: false } });
  await repository.db?.sync();
});
afterAll(async () => {
  await repository.db?.drop();
});

describe('Variable Repository', () => {
  test('Should be able to create a variable object', async () => {
    const Variable = repository.getModel<VariableInstance>('Variable');

    const object = await Variable.create({
      type: 'STRING',
      key: 'TEST_NAME',
      value: 'TEST_VALUE'  
    });

    expect(object.key).toEqual('TEST_NAME');
    expect(object.value).toEqual('TEST_VALUE');
    expect(object.type).toEqual('STRING');
  });

  test('Should throw an invalidation error when an improper Variable is made', async () => {
    const Variable = repository.getModel<VariableInstance>('Variable');

    await expect(
      Variable.create({
        type: 'INVALID',
        key: 'TEST_NAME',
        value: 'TEST_VALUE'
      })
    ).rejects.toThrow();

  });

  test('Should be able to create a List Type Variables with a null value', async () => {
    const Variable = repository.getModel<VariableInstance>('Variable');

    const object = await Variable.create({
      type: 'LIST',
      key: 'TEST_LIST',
    });

    expect(object.type).toEqual('LIST');
    expect(object.key).toEqual('TEST_LIST');
    expect(object.value).toEqual(undefined);
  });

  test('Should be able to create a List Item to connect to a list Variable', async () => {
    const Variable = repository.getModel<VariableInstance>('Variable');
    const ListItem = repository.getModel<ListItemInstance>('ListItem');

    const listObject = await Variable.create({
      type: 'LIST',
      key: 'MY_LIST',
    });
    const valueObject = await Variable.create({
      type: 'STRING',
      value: 'TEST_VALUE',
      key: 'VALUE_1'
    });
    const listItem = await ListItem.create({
      listId: listObject.id,
      resourceId: valueObject.id,
    });

    expect(listItem.resourceId).toEqual(valueObject.id);
    expect(listItem.listId).toEqual(listObject.id);
    expect(listItem.id).toBeTruthy();
  });
});