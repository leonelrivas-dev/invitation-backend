import { InvitationStatus } from 'src/modules/invitations/domain/enums/invitation-status';
import { InvitationId } from 'src/modules/invitations/domain/value-objects/invitation-id';
import { InvitationSlug } from 'src/modules/invitations/domain/value-objects/invitation-slug';
import { Phone } from 'src/modules/invitations/domain/value-objects/phone';

interface InvitationProps {
  id: InvitationId;
  eventId: string;
  name: string;
  slug: InvitationSlug;
  phone: Phone;
  allowedSeats: number;
  confirmedSeats: number;
  status: InvitationStatus;
  messageSentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Invitation {
  private constructor(private readonly props: InvitationProps) {}

  static create(params: {
    eventId: string;
    name: string;
    slug: InvitationSlug;
    phone: Phone;
    allowedSeats: number;
  }): Invitation {
    if (!params.eventId.trim()) throw new Error('Event id cannot be empty');
    if (!params.name.trim()) throw new Error('Invitation name cannot be empty');

    if (params.allowedSeats <= 0)
      throw new Error('Allowed seats must be greater than zero');

    const now = new Date();

    return new Invitation({
      id: InvitationId.create(),
      eventId: params.eventId,
      name: params.name.trim(),
      slug: params.slug,
      phone: params.phone,
      allowedSeats: params.allowedSeats,
      confirmedSeats: 0,
      status: InvitationStatus.PENDING,
      messageSentAt: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  updateDetails(params: {
    name: string;
    phone: Phone;
    allowedSeats: number;
  }): void {
    if (!params.name.trim()) throw new Error('Invitation name cannot be empty');

    if (params.allowedSeats <= 0)
      throw new Error('Allowed seats must be greater than zero');

    if (params.allowedSeats < this.props.confirmedSeats)
      throw new Error('Allowed seats cannot be less tha confirmed attendees');

    this.props.name = params.name.trim();
    this.props.phone = params.phone;
    this.props.allowedSeats = params.allowedSeats;
    this.props.updatedAt = new Date();
  }

  get id(): InvitationId {
    return this.props.id;
  }

  get eventId(): string {
    return this.props.eventId;
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): InvitationSlug {
    return this.props.slug;
  }

  get phone(): Phone {
    return this.props.phone;
  }

  get allowedSeats(): number {
    return this.props.allowedSeats;
  }

  get confirmedSeats(): number {
    return this.props.confirmedSeats;
  }

  get status(): InvitationStatus {
    return this.props.status;
  }

  get messageSentAt(): Date | null {
    return this.props.messageSentAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  confirm(attendees: number): void {
    if (attendees <= 0) throw new Error('Attendees must be greater than zero');

    if (attendees > this.props.allowedSeats)
      throw new Error('Attendees cannot exceed the allowed number of seats');

    this.props.confirmedSeats = attendees;
    this.props.status = InvitationStatus.CONFIRMED;
    this.props.updatedAt = new Date();
  }

  decline(): void {
    this.props.confirmedSeats = 0;
    this.props.status = InvitationStatus.DECLINED;
    this.props.updatedAt = new Date();
  }

  markMessageAsSent(): void {
    this.props.messageSentAt = new Date();
    this.props.updatedAt = new Date();
  }

  static reconstitute(props: {
    id: InvitationId;
    eventId: string;
    name: string;
    slug: InvitationSlug;
    phone: Phone;
    allowedSeats: number;
    confirmedSeats: number;
    status: InvitationStatus;
    messageSentAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): Invitation {
    return new Invitation(props);
  }
}
