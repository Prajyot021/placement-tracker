from datetime import datetime, date

from sqlalchemy import (
    String,
    Text,
    Integer,
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Numeric,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Company(Base):
    __tablename__ = "companies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(150), nullable=False, unique=True)
    logo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    website: Mapped[str | None] = mapped_column(String(500), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    jobs: Mapped[list["Job"]] = relationship(
        back_populates="company",
        cascade="all, delete-orphan"
    )


class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    company_id: Mapped[int] = mapped_column(
        ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False
    )

    title: Mapped[str] = mapped_column(String(200), nullable=False)

    job_type: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True
    )

    location: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True
    )

    package_min: Mapped[float | None] = mapped_column(
        Numeric(10, 2),
        nullable=True
    )

    package_max: Mapped[float | None] = mapped_column(
        Numeric(10, 2),
        nullable=True
    )

    package_unit: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True
    )

    status: Mapped[str] = mapped_column(
        String(50),
        default="OPEN",
        nullable=False
    )

    application_deadline: Mapped[date | None] = mapped_column(
        Date,
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    company: Mapped["Company"] = relationship(
        back_populates="jobs"
    )

    eligibility: Mapped["Eligibility | None"] = relationship(
        back_populates="job",
        cascade="all, delete-orphan",
        uselist=False
    )

    recruitment_events: Mapped[list["RecruitmentEvent"]] = relationship(
        back_populates="job",
        cascade="all, delete-orphan"
    )

    status_history: Mapped[list["StatusHistory"]] = relationship(
        back_populates="job",
        cascade="all, delete-orphan"
    )

    updates: Mapped[list["Update"]] = relationship(
        back_populates="job",
        cascade="all, delete-orphan"
    )


class Eligibility(Base):
    __tablename__ = "eligibility"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    job_id: Mapped[int] = mapped_column(
        ForeignKey("jobs.id", ondelete="CASCADE"),
        nullable=False,
        unique=True
    )

    min_cgpa: Mapped[float | None] = mapped_column(
        Numeric(3, 2),
        nullable=True
    )

    min_10th: Mapped[float | None] = mapped_column(
        Numeric(5, 2),
        nullable=True
    )

    min_12th: Mapped[float | None] = mapped_column(
        Numeric(5, 2),
        nullable=True
    )

    min_graduation: Mapped[float | None] = mapped_column(
        Numeric(5, 2),
        nullable=True
    )

    backlogs_allowed: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )

    eligible_branches: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    graduation_year_from: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )

    graduation_year_to: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )

    job: Mapped["Job"] = relationship(
        back_populates="eligibility"
    )


class RecruitmentEvent(Base):
    __tablename__ = "recruitment_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    job_id: Mapped[int] = mapped_column(
        ForeignKey("jobs.id", ondelete="CASCADE"),
        nullable=False
    )

    event_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    event_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    job: Mapped["Job"] = relationship(
        back_populates="recruitment_events"
    )


class StatusHistory(Base):
    __tablename__ = "status_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    job_id: Mapped[int] = mapped_column(
        ForeignKey("jobs.id", ondelete="CASCADE"),
        nullable=False
    )

    old_status: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True
    )

    new_status: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    changed_by: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    job: Mapped["Job"] = relationship(
        back_populates="status_history"
    )


class Update(Base):
    __tablename__ = "updates"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    job_id: Mapped[int] = mapped_column(
        ForeignKey("jobs.id", ondelete="CASCADE"),
        nullable=False
    )

    submitted_by: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True
    )

    update_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    evidence_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    status: Mapped[str] = mapped_column(
        String(50),
        default="PENDING",
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    job: Mapped["Job"] = relationship(
        back_populates="updates"
    )