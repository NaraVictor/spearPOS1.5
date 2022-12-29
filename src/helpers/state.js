import { atom } from "jotai";

const _register = atom( {} );
export const getRegisterAtom = atom( ( get ) => get( _register ) );

export const addRegisterAtom = atom( null, ( get, set, item ) => {
    set( _register, item );
} );

export const deleteRegisterAtom = atom( null, ( get, set, item ) => {
    set( _register, {} );
} );
