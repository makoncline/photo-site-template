import Typography from "~/components/typography";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { MarketingLayout } from "~/layouts/marketing-layout";

function TypographyDemo() {
  return (
    <MarketingLayout>
      <main className="container">
        <Typography.h1>The Joke Tax Chronicles</Typography.h1>
        <Typography.p>
          Once upon a time, in a far-off land, there was a very lazy king who
          spent all day lounging on his throne. One day, his advisors came to
          him with a problem: the kingdom was running out of money.
        </Typography.p>
        <Typography.h2>The King's Plan</Typography.h2>
        <Typography.p>
          The king thought long and hard, and finally came up with{" "}
          <a
            href="#"
            className="font-medium text-primary underline underline-offset-4"
          >
            a brilliant plan
          </a>
          : he would tax the jokes in the kingdom.
        </Typography.p>
        <Typography.blockquote>
          "After all," he said, "everyone enjoys a good joke, so it's only fair
          that they should pay for the privilege."
        </Typography.blockquote>
        <Typography.h3>The Joke Tax</Typography.h3>
        <Typography.p>
          The king's subjects were not amused. They grumbled and complained, but
          the king was firm:
        </Typography.p>
        <Typography.ul>
          <li>1st level of puns: 5 gold coins</li>
          <li>2nd level of jokes: 10 gold coins</li>
          <li>3rd level of one-liners : 20 gold coins</li>
        </Typography.ul>
        <Typography.p>
          As a result, people stopped telling jokes, and the kingdom fell into a
          gloom. But there was one person who refused to let the king's
          foolishness get him down: a court jester named Jokester.
        </Typography.p>
        <Typography.h3>Jokester's Revolt</Typography.h3>
        <Typography.p>
          Jokester began sneaking into the castle in the middle of the night and
          leaving jokes all over the place: under the king's pillow, in his
          soup, even in the royal toilet. The king was furious, but he couldn't
          seem to stop Jokester.
        </Typography.p>
        <Typography.p>
          And then, one day, the people of the kingdom discovered that the jokes
          left by Jokester were so funny that they couldn't help but laugh. And
          once they started laughing, they couldn't stop.
        </Typography.p>
        <Typography.h3>The People's Rebellion</Typography.h3>
        <Typography.p>
          The people of the kingdom, feeling uplifted by the laughter, started
          to tell jokes and puns again, and soon the entire kingdom was in on
          the joke.
        </Typography.p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>King's Treasury</TableHead>
              <TableHead>People's happiness</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Empty</TableCell>
              <TableCell>Overflowing</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Modest</TableCell>
              <TableCell>Satisfied</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Full</TableCell>
              <TableCell>Ecstatic</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Typography.p>
          The king, seeing how much happier his subjects were, realized the
          error of his ways and repealed the joke tax. Jokester was declared a
          hero, and the kingdom lived happily ever after.
        </Typography.p>
        <Typography.p>
          The moral of the story is: never underestimate the power of a good
          laugh and always be careful of bad ideas.
        </Typography.p>
      </main>
    </MarketingLayout>
  );
}

export default TypographyDemo;
