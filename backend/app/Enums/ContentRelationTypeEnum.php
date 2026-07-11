<?php

namespace App\Enums;

/**
 * Constrained set of content relationship types.
 * Use these constants everywhere — never raw strings.
 *
 * Examples:
 *   $blog->relateTo($portfolio, ContentRelationTypeEnum::RELATED);
 *   $portfolio->relateTo($caseStudy, ContentRelationTypeEnum::PRIMARY_OF);
 *   $caseStudy->relateTo($blog, ContentRelationTypeEnum::REFERENCES);
 */
enum ContentRelationTypeEnum: string
{
    /** General "see also" link */
    case RELATED = 'related';

    /** Cites, quotes, or builds upon another piece */
    case REFERENCES = 'references';

    /** This content is the primary story for another (e.g. CaseStudy is PRIMARY_OF Portfolio) */
    case PRIMARY_OF = 'primary_of';

    /** Hierarchical — this content is a child/sub-item of another */
    case CHILD_OF = 'child_of';

    /** This is derived from / adapted from another piece */
    case DERIVED_FROM = 'derived_from';

    /** Alternative presentation of the same topic */
    case ALTERNATIVE = 'alternative';

    /** This content supersedes / comes after another (e.g. Blog post v2) */
    case SUCCESSOR = 'successor';

    /** This content was superseded by another */
    case PREDECESSOR = 'predecessor';

    public function label(): string
    {
        return match($this) {
            self::RELATED      => 'Related',
            self::REFERENCES   => 'References',
            self::PRIMARY_OF   => 'Primary Of',
            self::CHILD_OF     => 'Child Of',
            self::DERIVED_FROM => 'Derived From',
            self::ALTERNATIVE  => 'Alternative',
            self::SUCCESSOR    => 'Successor',
            self::PREDECESSOR  => 'Predecessor',
        };
    }

    /** Returns the natural inverse relation type */
    public function inverse(): self
    {
        return match($this) {
            self::PRIMARY_OF   => self::PRIMARY_OF,
            self::CHILD_OF     => self::CHILD_OF,
            self::DERIVED_FROM => self::DERIVED_FROM,
            self::SUCCESSOR    => self::PREDECESSOR,
            self::PREDECESSOR  => self::SUCCESSOR,
            default            => $this,
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
