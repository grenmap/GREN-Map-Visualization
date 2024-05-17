import { TestBed, waitForAsync } from '@angular/core/testing';
import { StripURLPipe } from './strip-url.pipe';

describe('StripURLPipe', () => {
  let pipe: StripURLPipe;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [StripURLPipe]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    pipe = new StripURLPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should strip leading protocol information from an HTTP URL', () => {
    expect(pipe.transform(
      'http://www.example.com',
    )).toEqual(
      'www.example.com',
    );
  });

  it('should strip leading protocol information from an HTTPS URL', () => {
    expect(pipe.transform(
      'https://www.example.com',
    )).toEqual(
      'www.example.com',
    );
  });

  it('should strip trailing slashes protocol information from a URL', () => {
    expect(pipe.transform(
      'www.example.com/path/',
    )).toEqual(
      'www.example.com/path',
    );
  });

  it('should leave trailing-filename-style URLs alone', () => {
    expect(pipe.transform(
      'www.example.com/page.html',
    )).toEqual(
      'www.example.com/page.html',
    );
  });

  it('should strip leading protocol information and the trailing slash from an HTTP URL', () => {
    expect(pipe.transform(
      'http://www.example.com/path/',
    )).toEqual(
      'www.example.com/path',
    );
  });
});
