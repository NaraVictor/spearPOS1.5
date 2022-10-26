import { useAtom } from "jotai"
import { getRegisterAtom, deleteRegisterAtom, addRegisterAtom } from './state'

export function useGetRegister () {
    const [ register ] = useAtom( getRegisterAtom )
    return register
}

export function useAddRegister () {
    const [ , addRegister ] = useAtom( addRegisterAtom )
    return addRegister
}

export function useDeleteRegister () {
    const [ , deleteRegister ] = useAtom( deleteRegisterAtom )
    return deleteRegister
}