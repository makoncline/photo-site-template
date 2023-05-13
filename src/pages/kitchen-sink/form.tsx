import { z } from "zod";
import { useZodForm } from "~/hooks/useZodForm";
import { withProtectedAuth } from "~/lib/withAuth";
import { api } from "~/utils/api";

// validation schema is used by server
export const validationSchema = z.object({
  title: z.string().min(2),
  text: z.string().min(5),
});

const FormPage = () => {
  const utils = api.useContext();
  const query = api.example.list.useQuery(undefined, {
    suspense: true,
  });

  const posts = query.data;

  const mutation = api.example.add.useMutation({
    onSuccess: async () => {
      // invalidate the query
      // could also invalidate all on every mutation
      // https://trpc.io/docs/useContext#invalidate-full-cache-on-every-mutation
      await utils.example.list.invalidate();
    },
  });

  const { handleSubmit, reset, register, formState } = useZodForm({
    schema: validationSchema,
  });

  return (
    <>
      <h2 className="text-3xl">Posts</h2>
      <div className="flex flex-col gap-2 py-2">
        {posts &&
          posts.map((post) => (
            <article
              key={post.id}
              className="overflow-hidden bg-surface-2 p-4 shadow sm:rounded-lg"
            >
              <h3 className="text-xl">{post.title}</h3>
              <p className="my-2">{post.text}</p>
            </article>
          ))}
      </div>

      <h2 className="text-2xl">Add a post</h2>
      <form
        onSubmit={handleSubmit(async (values) => {
          await mutation.mutateAsync(values);
          reset();
        })}
        className="space-y-2"
      >
        <div>
          <label>
            Title
            <input {...register("title")} className=" bg-surface-2" />
          </label>

          {formState.errors.title?.message && (
            <p className="text-danger">{formState.errors.title?.message}</p>
          )}
        </div>
        <div>
          <label>
            Text
            <textarea {...register("text")} className=" bg-surface-2" />
          </label>
          {formState.errors.text?.message && (
            <p className="text-danger">{formState.errors.text?.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={mutation.isLoading}
          className="bg-brand-1 p-2"
        >
          {mutation.isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
    </>
  );
};

export default withProtectedAuth(FormPage);
