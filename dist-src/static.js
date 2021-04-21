"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.successMessages = exports.errorMessages = void 0;
var errorMessages = {
  REMOVE_CLIENT: 'Pacientul nu a putut fi șters din sistem.',
  REMOVE_APPOINTMENT: 'Programarea nu a putut fi anulată.',
  REMOVE_CONTROL: 'Controlul nu a putut fi anulat.',
  GET_CLIENTS: 'Pacienții nu au putut fi actualizați.',
  GET_APPOINTMENTS_AND_CONTROLS: 'Programările nu au putut fi actualizate.',
  ADD_APPOINTMENT: 'Programarea nu a putut fi adăugată.',
  ADD_CLIENT: 'Pacientul nu a putut fi adăugat în sistem.',
  MODIFY_APPOINTMENT: 'Programarea nu a putut fi modificată.',
  MODIFY_CONTROL: 'Controlul nu a putut fi modificat.'
};
exports.errorMessages = errorMessages;
var successMessages = {
  REMOVE_CLIENT: 'Pacientul a fost șters din sistem cu succes.',
  REMOVE_APPOINTMENT: 'Programarea a fost anulată cu succes.',
  REMOVE_CONTROL: 'Controlul a fost anulat cu succes.',
  GET_CLIENTS: 'Pacienții au fost actualizați cu succes.',
  GET_APPOINTMENTS_AND_CONTROLS: 'Toate programările au fost actualizate cu succes.',
  ADD_APPOINTMENT: 'Programarea a fost adăugată cu succes.',
  ADD_CLIENT: 'Pacientul a fost adăugat în sistem cu succes.',
  MODIFY_APPOINTMENT: 'Programarea a fost modificată cu succes.',
  MODIFY_CONTROL: 'Controlul a fost modificat cu succes.'
};
exports.successMessages = successMessages;