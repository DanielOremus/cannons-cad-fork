import { CreateIncidentNoteDto } from '../../dto/note/create-incident-note.dto.js';
import { IncidentNoteEntity } from '../../entities/incident-note.entity.js';
import { IncidentEntity } from '../../entities/incident.entity.js';

export type CreateIncidentNoteInput = CreateIncidentNoteDto &
  Pick<IncidentNoteEntity, 'author'> & {
    incident: IncidentEntity | IncidentNoteEntity['id'];
  };
