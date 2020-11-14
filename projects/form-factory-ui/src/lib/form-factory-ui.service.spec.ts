import { TestBed } from '@angular/core/testing';

import { FormFactoryUiService } from './form-factory-ui.service';

describe('FormFactoryUiService', () => {
    let service: FormFactoryUiService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FormFactoryUiService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
