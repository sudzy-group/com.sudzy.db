import { isString } from 'lodash';

export function mobile(input) {
    return isString(input) && input.length < 16;
}