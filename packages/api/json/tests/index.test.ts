import commentJSON from 'comment-json';
import * as declarationUpdate from 'declaration-update';

describe('update json', () => {
  it('simple string', () => {
    const jsonContent = commentJSON.parse('{}');
    declarationUpdate.query(
      jsonContent,
      {},
      {
        $set: { a: '1' },
      },
    );
    expect(jsonContent).toEqual({ a: '1' });
  });
  it('complex string', () => {
    const jsonContent = commentJSON.parse('{}');
    declarationUpdate.query(
      jsonContent,
      {},
      {
        $set: {
          a: {
            b: '2',
          },
        },
      },
    );
    expect(jsonContent).toEqual({
      a: {
        b: '2',
      },
    });
  });
  it('simple array', () => {
    const jsonContent = commentJSON.parse('{}');
    declarationUpdate.query(
      jsonContent,
      {},
      {
        $set: ['1', '2', '3'],
      },
    );
    expect(jsonContent).toEqual({
      '0': '1',
      '1': '2',
      '2': '3',
    });
  });
  it('complex array', () => {
    const jsonContent = commentJSON.parse('{}');
    declarationUpdate.query(
      jsonContent,
      {},
      {
        $set: [
          {
            a: '1',
          },
          {
            b: '2',
          },
          {
            c: '3',
          },
        ],
      },
    );
    expect(jsonContent).toEqual({
      '0': {
        a: '1',
      },
      '1': {
        b: '2',
      },
      '2': {
        c: '3',
      },
    });
  });
  it('string and array', () => {
    const jsonContent = commentJSON.parse('{}');
    declarationUpdate.query(
      jsonContent,
      {},
      {
        $set: {
          a: ['1', '2', '3'],
          b: {
            b1: 'b1',
          },
        },
      },
    );
    expect(jsonContent).toEqual({
      a: ['1', '2', '3'],
      b: {
        b1: 'b1',
      },
    });
  });
});
